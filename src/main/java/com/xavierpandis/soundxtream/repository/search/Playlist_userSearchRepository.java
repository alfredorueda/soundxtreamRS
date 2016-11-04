package com.xavierpandis.soundxtream.repository.search;

import com.xavierpandis.soundxtream.domain.Playlist_user;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data ElasticSearch repository for the Playlist_user entity.
 */
public interface Playlist_userSearchRepository extends ElasticsearchRepository<Playlist_user, Long> {
}
