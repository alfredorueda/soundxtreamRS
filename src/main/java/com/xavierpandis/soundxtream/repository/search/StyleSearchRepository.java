package com.xavierpandis.soundxtream.repository.search;

import com.xavierpandis.soundxtream.domain.Style;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data ElasticSearch repository for the Style entity.
 */
public interface StyleSearchRepository extends ElasticsearchRepository<Style, Long> {
}
