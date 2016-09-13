package com.xavierpandis.soundxtream.repository.search;

import com.xavierpandis.soundxtream.domain.Playlist;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data ElasticSearch repository for the Playlist entity.
 */
public interface PlaylistSearchRepository extends ElasticsearchRepository<Playlist, Long> {
}
