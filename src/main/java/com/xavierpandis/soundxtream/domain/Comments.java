package com.xavierpandis.soundxtream.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import java.time.ZonedDateTime;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Comments.
 */
@Entity
@Table(name = "comments")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "comments")
public class Comments implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull
    @Column(name = "comment_text", nullable = false)
    private String comment_text;
    
    @NotNull
    @Column(name = "date_comment", nullable = false)
    private ZonedDateTime date_comment;
    
    @ManyToOne
    @JoinColumn(name = "song_id")
    private Song song;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getComment_text() {
        return comment_text;
    }
    
    public void setComment_text(String comment_text) {
        this.comment_text = comment_text;
    }

    public ZonedDateTime getDate_comment() {
        return date_comment;
    }
    
    public void setDate_comment(ZonedDateTime date_comment) {
        this.date_comment = date_comment;
    }

    public Song getSong() {
        return song;
    }

    public void setSong(Song song) {
        this.song = song;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Comments comments = (Comments) o;
        if(comments.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, comments.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Comments{" +
            "id=" + id +
            ", comment_text='" + comment_text + "'" +
            ", date_comment='" + date_comment + "'" +
            '}';
    }
}
