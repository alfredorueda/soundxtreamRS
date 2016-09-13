package com.xavierpandis.soundxtream.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import java.time.ZonedDateTime;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Song_user.
 */
@Entity
@Table(name = "song_user")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "song_user")
public class Song_user implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "liked")
    private Boolean liked;
    
    @Column(name = "shared")
    private Boolean shared;
    
    @Column(name = "liked_date")
    private ZonedDateTime likedDate;
    
    @Column(name = "shared_date")
    private ZonedDateTime sharedDate;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "song_id")
    private Song song;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getLiked() {
        return liked;
    }
    
    public void setLiked(Boolean liked) {
        this.liked = liked;
    }

    public Boolean getShared() {
        return shared;
    }
    
    public void setShared(Boolean shared) {
        this.shared = shared;
    }

    public ZonedDateTime getLikedDate() {
        return likedDate;
    }
    
    public void setLikedDate(ZonedDateTime likedDate) {
        this.likedDate = likedDate;
    }

    public ZonedDateTime getSharedDate() {
        return sharedDate;
    }
    
    public void setSharedDate(ZonedDateTime sharedDate) {
        this.sharedDate = sharedDate;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Song getSong() {
        return song;
    }

    public void setSong(Song song) {
        this.song = song;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Song_user song_user = (Song_user) o;
        if(song_user.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, song_user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Song_user{" +
            "id=" + id +
            ", liked='" + liked + "'" +
            ", shared='" + shared + "'" +
            ", likedDate='" + likedDate + "'" +
            ", sharedDate='" + sharedDate + "'" +
            '}';
    }
}
