package com.xavierpandis.soundxtream.repository.search;

import com.xavierpandis.soundxtream.domain.Samples;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data ElasticSearch repository for the Samples entity.
 */
public interface SamplesSearchRepository extends ElasticsearchRepository<Samples, Long> {
}
