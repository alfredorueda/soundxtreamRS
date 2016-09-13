package com.xavierpandis.soundxtream.repository.search;

import com.xavierpandis.soundxtream.domain.Song_user;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data ElasticSearch repository for the Song_user entity.
 */
public interface Song_userSearchRepository extends ElasticsearchRepository<Song_user, Long> {
}
