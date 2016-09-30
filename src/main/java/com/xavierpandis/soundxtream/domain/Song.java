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
 * A Song.
 */
@Entity
@Table(name = "song")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "song")
public class Song implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;
    
    @NotNull
    @Column(name = "url", nullable = false)
    private String url;
    
    @NotNull
    @Column(name = "label", nullable = false)
    private String label;
    
    @Column(name = "date_posted")
    private ZonedDateTime date_posted;
    
    @Column(name = "artwork")
    private String artwork;
    
    @Column(name = "banner_song")
    private String banner_song;
    
    @Column(name = "tags")
    private String tags;
    
    @Column(name = "duration")
    private Float duration;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "plays_count")
    private Integer playsCount;
    
    @Column(name = "type_song")
    private String typeSong;
    
    @Column(name = "bpm")
    private Integer bpm;
    
    @Column(name = "access_url")
    private String access_url;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "song_style",
               joinColumns = @JoinColumn(name="songs_id", referencedColumnName="ID"),
               inverseJoinColumns = @JoinColumn(name="styles_id", referencedColumnName="ID"))
    private Set<Style> styles = new HashSet<>();

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

    public String getUrl() {
        return url;
    }
    
    public void setUrl(String url) {
        this.url = url;
    }

    public String getLabel() {
        return label;
    }
    
    public void setLabel(String label) {
        this.label = label;
    }

    public ZonedDateTime getDate_posted() {
        return date_posted;
    }
    
    public void setDate_posted(ZonedDateTime date_posted) {
        this.date_posted = date_posted;
    }

    public String getArtwork() {
        return artwork;
    }
    
    public void setArtwork(String artwork) {
        this.artwork = artwork;
    }

    public String getBanner_song() {
        return banner_song;
    }
    
    public void setBanner_song(String banner_song) {
        this.banner_song = banner_song;
    }

    public String getTags() {
        return tags;
    }
    
    public void setTags(String tags) {
        this.tags = tags;
    }

    public Float getDuration() {
        return duration;
    }
    
    public void setDuration(Float duration) {
        this.duration = duration;
    }

    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getPlaysCount() {
        return playsCount;
    }
    
    public void setPlaysCount(Integer playsCount) {
        this.playsCount = playsCount;
    }

    public String getTypeSong() {
        return typeSong;
    }
    
    public void setTypeSong(String typeSong) {
        this.typeSong = typeSong;
    }

    public Integer getBpm() {
        return bpm;
    }
    
    public void setBpm(Integer bpm) {
        this.bpm = bpm;
    }

    public String getAccess_url() {
        return access_url;
    }
    
    public void setAccess_url(String access_url) {
        this.access_url = access_url;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Set<Style> getStyles() {
        return styles;
    }

    public void setStyles(Set<Style> styles) {
        this.styles = styles;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Song song = (Song) o;
        if(song.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, song.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Song{" +
            "id=" + id +
            ", name='" + name + "'" +
            ", url='" + url + "'" +
            ", label='" + label + "'" +
            ", date_posted='" + date_posted + "'" +
            ", artwork='" + artwork + "'" +
            ", banner_song='" + banner_song + "'" +
            ", tags='" + tags + "'" +
            ", duration='" + duration + "'" +
            ", description='" + description + "'" +
            ", playsCount='" + playsCount + "'" +
            ", typeSong='" + typeSong + "'" +
            ", bpm='" + bpm + "'" +
            ", access_url='" + access_url + "'" +
            '}';
    }
}
