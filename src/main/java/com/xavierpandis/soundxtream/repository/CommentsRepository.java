package com.xavierpandis.soundxtream.repository;

import com.xavierpandis.soundxtream.domain.Comments;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the Comments entity.
 */
public interface CommentsRepository extends JpaRepository<Comments,Long> {

    @Query("select comments from Comments comments where comments.user.login = ?#{principal.username}")
    List<Comments> findByUserIsCurrentUser();

    @Query("select comments from Comments comments where comments.song.id = :song_id")
    Page<Comments> findCommentsBySong(@Param("song_id") Long id,Pageable pageable);

}
