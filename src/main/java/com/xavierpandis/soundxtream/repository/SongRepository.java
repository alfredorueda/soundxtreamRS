package com.xavierpandis.soundxtream.repository;

import com.xavierpandis.soundxtream.domain.Song;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the Song entity.
 */
public interface SongRepository extends JpaRepository<Song,Long> {

    @Query("select song from Song song where song.user.login = ?#{principal.username}")
    Page<Song> findByUserIsCurrentUser(Pageable pageable);

    @Query("select song from Song song where song.user.login = :login")
    Page<Song> findByUserTracks(@Param("login") String login, Pageable pageable);

    @Query("select distinct song from Song song left join fetch song.styles")
    List<Song> findAllWithEagerRelationships();

    @Query("select song from Song song left join fetch song.styles where song.id =:id")
    Song findOneWithEagerRelationships(@Param("id") Long id);



}
