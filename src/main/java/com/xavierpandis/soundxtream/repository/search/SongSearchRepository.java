package com.xavierpandis.soundxtream.repository.search;

import com.xavierpandis.soundxtream.domain.Song;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data ElasticSearch repository for the Song entity.
 */
public interface SongSearchRepository extends ElasticsearchRepository<Song, Long> {
}
