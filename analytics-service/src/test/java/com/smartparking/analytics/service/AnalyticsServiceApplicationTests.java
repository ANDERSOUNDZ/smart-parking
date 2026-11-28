package com.smartparking.analytics.service;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
		"spring.datasource.url=jdbc:h2:mem:prueba",
		"eureka.client.enabled=false" })
class AnalyticsServiceApplicationTests {

	@Test
	void contextLoads() {
	}

}
