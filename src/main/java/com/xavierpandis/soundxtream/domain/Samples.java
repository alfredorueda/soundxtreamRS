package com.xavierpandis.soundxtream.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Samples.
 */
@Entity
@Table(name = "samples")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "samples")
public class Samples implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;
    
    @NotNull
    @Column(name = "duration", nullable = false)
    private Float duration;
    
    @Column(name = "tags")
    private String tags;
    
    @Column(name = "url")
    private String url;
    
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

    public Float getDuration() {
        return duration;
    }
    
    public void setDuration(Float duration) {
        this.duration = duration;
    }

    public String getTags() {
        return tags;
    }
    
    public void setTags(String tags) {
        this.tags = tags;
    }

    public String getUrl() {
        return url;
    }
    
    public void setUrl(String url) {
        this.url = url;
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
        Samples samples = (Samples) o;
        if(samples.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, samples.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Samples{" +
            "id=" + id +
            ", name='" + name + "'" +
            ", duration='" + duration + "'" +
            ", tags='" + tags + "'" +
            ", url='" + url + "'" +
            '}';
    }
}
