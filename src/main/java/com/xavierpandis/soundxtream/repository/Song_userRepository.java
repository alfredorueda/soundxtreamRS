package com.xavierpandis.soundxtream.repository;

import com.xavierpandis.soundxtream.domain.Song_user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the Song_user entity.
 */
public interface Song_userRepository extends JpaRepository<Song_user,Long> {

    /*@Query("select song_user from Song_user song_user where song_user.user.login = ?#{principal.username}")
    List<Song_user> findByUserIsCurrentUser();*/

    @Query("select song_user from Song_user song_user where song_user.user.login = ?#{principal.username}")
    Page<Song_user> findByUserIsCurrentUser(Pageable pageable);

    @Query("select song_user from Song_user song_user where song_user.user.login = :login AND song_user.song.id = :song_id")
    Song_user findExistUserLiked(@Param("song_id") Long id,@Param("login") String login);

    @Query("select count(song_user) from Song_user song_user WHERE song_user.song.id = :song_id AND song_user.liked = true")
    int findTotalLikes(@Param("song_id") Long id);

    @Query("select count(song_user) from Song_user song_user WHERE song_user.song.id = :song_id AND song_user.shared = true")
    int findTotalShares(@Param("song_id") Long id);

    @Query("select song_user from Song_user song_user where song_user.liked = true")
    Page<Song_user> findSongsLiked(Pageable pageable);

    @Query("select song_user from Song_user song_user where song_user.user.login = :login ORDER BY song_user.likedDate DESC")
    Page<Song_user> findLikesUser(@Param("login") String login, Pageable pageable);

    @Query("select count(song_user) from Song_user song_user where song_user.user.login = :login AND song_user.liked = true")
    int totalLikesOfUser (@Param("login") String login);

    @Query("select count(song_user) from Song_user song_user where song_user.user.login = ?#{principal.username} AND song_user.liked = true")
    int totalLikesUserLogged();
}
