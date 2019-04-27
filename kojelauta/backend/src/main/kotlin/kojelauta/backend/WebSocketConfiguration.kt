package kojelauta.backend

import com.fasterxml.jackson.databind.ObjectMapper
import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.reactive.HandlerMapping
import org.springframework.web.reactive.handler.SimpleUrlHandlerMapping
import org.springframework.web.reactive.socket.WebSocketHandler
import org.springframework.web.reactive.socket.server.support.WebSocketHandlerAdapter
import reactor.core.publisher.Flux
import java.math.BigDecimal
import java.time.Duration
import kotlin.random.Random
import java.lang.management.ManagementFactory

open class Event(val type: String)

data class TemperatureMeasurementEvents(val measurements: List<Pair<String, BigDecimal>>) : Event("temperature")

enum class AlertSeverity {
    DISASTER,
    DANGER,
    WARNING,
    INFO
}

data class AlertEvent(val severity: AlertSeverity,
                      val message: String) : Event("alert")

@Configuration
class WebSocketConfiguration(private val objectMapper: ObjectMapper) {

    private val log = LoggerFactory.getLogger(this.javaClass)

    private val alertEvents = Flux.interval(Duration.ofSeconds(5))
        .map {
            log.info("Emitting alert")
            when (Random.nextInt(0, 6)) {
                0 -> ("Levytila loppui!" to AlertSeverity.DANGER)
                1 -> ("Palvelimet palavat!" to AlertSeverity.DANGER)
                2 -> ("Palvelimet sauhuttavat vain vähän" to AlertSeverity.WARNING)
                3 -> ("Kaikki palaa!" to AlertSeverity.DISASTER)
                4 -> ("Mikään ei pala juuri nyt" to AlertSeverity.INFO)
                5 -> ("Kahvi loppu!" to AlertSeverity.DISASTER)
                else -> ("Kaikki OK" to AlertSeverity.INFO)
            }
            .let { (msg, severity) -> AlertEvent(severity, msg) }
        }

    private val temperatureEvents = Flux.interval(Duration.ofSeconds(1))
        .map {
            log.info("Emitting temperatures")
            TemperatureMeasurementEvents(
                measurements = listOf(
                    "Palvelin 1" to BigDecimal(Random.nextInt(10, 20)),
                    "Palvelin 2" to BigDecimal(Random.nextInt(10, 20)),
                    "Palvelin 3" to BigDecimal(Random.nextInt(10, 20))
                )
            )
        }

    private val events: Flux<Event> =
        Flux.merge(alertEvents, temperatureEvents)
        .share()
        .doOnSubscribe { log.info("Events subscribed") }
        .doFinally { log.info("Events unsubscribed") }

    @Bean
    fun webSocketHandler(handler: WebSocketHandler): HandlerMapping {
        val mapping = SimpleUrlHandlerMapping()
        mapping.order = 1
        mapping.urlMap = mapOf(
            "/events" to handler
        )
        return mapping
    }

    @Bean
    fun handlerAdapter() = WebSocketHandlerAdapter()

    @Bean
    fun websocketHandler() = WebSocketHandler { session ->
        session.receive()
            .then()
            .doFinally { log.info("WebSocket disconnected") }
            .and(
                session.send(
                    events.map {
                        session.textMessage(objectMapper.writeValueAsString(it))
                    }
                )
                .doOnSubscribe { log.info("WebSocket connected") }
            )
    }
}
