package com.xavierpandis.soundxtream.repository;

import com.xavierpandis.soundxtream.domain.Playlist_user;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the Playlist_user entity.
 */
public interface Playlist_userRepository extends JpaRepository<Playlist_user,Long> {

    @Query("select playlist_user from Playlist_user playlist_user where playlist_user.user.login = ?#{principal.username}")
    List<Playlist_user> findByUserIsCurrentUser();

    @Query("select playlist_user from Playlist_user playlist_user where playlist_user.user.login = :login AND playlist_user.playlist.id = :playlist_id")
    Playlist_user findExistUserLiked(@Param("playlist_id") Long id, @Param("login") String login);

    @Query("select count(playlist_user) from Playlist_user playlist_user WHERE playlist_user.playlist.id = :song_id AND playlist_user.liked = true")
    int findTotalLikes(@Param("song_id") Long id);

    @Query("select count(playlist_user) from Playlist_user playlist_user WHERE playlist_user.playlist.id = :song_id AND playlist_user.shared = true")
    int findTotalShares(@Param("song_id") Long id);

    @Query("select playlist_user from Playlist_user playlist_user where playlist_user.liked = true")
    Page<Playlist_user> findSongsLiked(Pageable pageable);

    @Query("select playlist_user from Playlist_user playlist_user where playlist_user.user.login = :login ORDER BY playlist_user.likedDate DESC")
    Page<Playlist_user> findLikesUser(@Param("login") String login, Pageable pageable);

    @Query("select count(playlist_user) from Playlist_user playlist_user where playlist_user.user.login = :login AND playlist_user.liked = true")
    int totalLikesOfUser (@Param("login") String login);

}
