package com.xavierpandis.soundxtream.repository;

import com.xavierpandis.soundxtream.domain.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the Seguimiento entity.
 */
public interface SeguimientoRepository extends JpaRepository<Seguimiento,Long> {

    @Query("select seguimiento from Seguimiento seguimiento where seguimiento.seguidor.login = ?#{principal.username}")
    List<Seguimiento> findBySeguidorIsCurrentUser();

    @Query("select seguimiento from Seguimiento seguimiento where seguimiento.seguido.login = ?#{principal.username}")
    List<Seguimiento> findBySeguidoIsCurrentUser();

    @Query("select seguimiento from Seguimiento seguimiento where seguimiento.seguidor.login = :seguidor AND seguimiento.seguido.login = :seguido")
    Seguimiento findExistSeguimiento(@Param("seguidor") String seguidor, @Param("seguido") String seguido);

    @Query("select count(seguimiento) from Seguimiento seguimiento where seguimiento.seguido.login = :login AND seguimiento.siguiendo = true")
    int totalFollowersUser (@Param("login") String login);

    @Query("select count(seguimiento) from Seguimiento seguimiento where seguimiento.seguidor.login = :login AND seguimiento.siguiendo = true")
    int totalFollowingsUser (@Param("login") String login);

    @Query("select seguimiento from Seguimiento seguimiento where seguimiento.seguido.login = :login AND seguimiento.siguiendo = true")
    List<Seguimiento> findAllFollowers (@Param("login") String login);

    @Query("select seguimiento from Seguimiento seguimiento where seguimiento.seguidor.login = :login AND seguimiento.siguiendo = true")
    List<Seguimiento> findAllFollowing (@Param("login") String login);

    @Query("select song from Seguimiento as seguimiento, Song as song where seguimiento.seguido.id = song.user.id AND seguimiento.seguidor.login = :login AND seguimiento.siguiendo = true")
    Page<Song> findAllTracksFollowing (@Param("login") String login, Pageable pageable);

    @Query("select playlist from Seguimiento as seguimiento, Playlist as playlist where seguimiento.seguido.id = playlist.user.id AND seguimiento.seguidor.login = :login AND seguimiento.siguiendo = true")
    Page<Playlist> findAllPlaylistsFollowing (@Param("login") String login, Pageable pageable);

    @Query("select distinct song,playlist,song_user from Seguimiento as seguimiento, Song as song, " +
        "Playlist as playlist, Song_user as song_user where seguimiento.seguido.id = song_user.user.id AND song_user.shared = true AND seguimiento.seguido.id = playlist.user.id AND  seguimiento.seguido.id = song.user.id AND seguimiento.seguidor.login = :login AND seguimiento.siguiendo = true")
    Page<Object[]> findAllActFollowing (@Param("login") String login, Pageable pageable);

}
