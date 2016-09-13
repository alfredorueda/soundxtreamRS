package com.xavierpandis.soundxtream.repository.search;

import com.xavierpandis.soundxtream.domain.Seguimiento;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data ElasticSearch repository for the Seguimiento entity.
 */
public interface SeguimientoSearchRepository extends ElasticsearchRepository<Seguimiento, Long> {
}
