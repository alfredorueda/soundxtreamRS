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
 * A Playlist.
 */
@Entity
@Table(name = "playlist")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "playlist")
public class Playlist implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "artwork")
    private String artwork;

    @Column(name = "date_created")
    private ZonedDateTime dateCreated;

    @Column(name = "full_duration")
    private Double full_duration;

    @Column(name = "banner_playlist")
    private String banner_playlist;

    @Column(name = "access_url")
    private String access_url;

    @ManyToMany(fetch=FetchType.EAGER)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "playlist_song",
               joinColumns = @JoinColumn(name="playlists_id", referencedColumnName="ID"),
               inverseJoinColumns = @JoinColumn(name="songs_id", referencedColumnName="ID"))
    private Set<Song> songs = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getArtwork() {
        return artwork;
    }

    public void setArtwork(String artwork) {
        this.artwork = artwork;
    }

    public ZonedDateTime getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(ZonedDateTime dateCreated) {
        this.dateCreated = dateCreated;
    }

    public Double getFull_duration() {
        return full_duration;
    }

    public void setFull_duration(Double full_duration) {
        this.full_duration = full_duration;
    }

    public String getBanner_playlist() {
        return banner_playlist;
    }

    public void setBanner_playlist(String banner_playlist) {
        this.banner_playlist = banner_playlist;
    }

    public String getAccess_url() {
        return access_url;
    }

    public void setAccess_url(String access_url) {
        this.access_url = access_url;
    }

    public Set<Song> getSongs() {
        return songs;
    }

    public void setSongs(Set<Song> songs) {
        this.songs = songs;
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
        Playlist playlist = (Playlist) o;
        if(playlist.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, playlist.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Playlist{" +
            "id=" + id +
            ", name='" + name + "'" +
            ", artwork='" + artwork + "'" +
            ", dateCreated='" + dateCreated + "'" +
            ", full_duration='" + full_duration + "'" +
            ", banner_playlist='" + banner_playlist + "'" +
            ", access_url='" + access_url + "'" +
            '}';
    }
}
