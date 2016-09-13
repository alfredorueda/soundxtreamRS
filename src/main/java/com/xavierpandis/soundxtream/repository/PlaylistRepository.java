package com.xavierpandis.soundxtream.repository;

import com.xavierpandis.soundxtream.domain.Playlist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the Playlist entity.
 */
public interface PlaylistRepository extends JpaRepository<Playlist,Long> {

    @Query("select playlist from Playlist playlist where playlist.user.login = ?#{principal.username}")
    Page<Playlist> findByUserIsCurrentUser(Pageable pageable);

    @Query("select distinct playlist from Playlist playlist left join fetch playlist.songs")
    List<Playlist> findAllWithEagerRelationships();

    @Query("select playlist from Playlist playlist left join fetch playlist.songs where playlist.id =:id")
    Playlist findOneWithEagerRelationships(@Param("id") Long id);

    @Query("select playlist from Playlist playlist where playlist.user.login = :login")
    Page<Playlist> findPlaylistsUser(@Param("login") String login,Pageable pageable);



}
