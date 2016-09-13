package com.xavierpandis.soundxtream.repository.search;

import com.xavierpandis.soundxtream.domain.Comments;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data ElasticSearch repository for the Comments entity.
 */
public interface CommentsSearchRepository extends ElasticsearchRepository<Comments, Long> {
}
