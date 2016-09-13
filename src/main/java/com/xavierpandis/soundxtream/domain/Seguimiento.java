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
 * A Seguimiento.
 */
@Entity
@Table(name = "seguimiento")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "seguimiento")
public class Seguimiento implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "fecha")
    private ZonedDateTime fecha;
    
    @Column(name = "siguiendo")
    private Boolean siguiendo;
    
    @ManyToOne
    @JoinColumn(name = "seguidor_id")
    private User seguidor;

    @ManyToOne
    @JoinColumn(name = "seguido_id")
    private User seguido;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getFecha() {
        return fecha;
    }
    
    public void setFecha(ZonedDateTime fecha) {
        this.fecha = fecha;
    }

    public Boolean getSiguiendo() {
        return siguiendo;
    }
    
    public void setSiguiendo(Boolean siguiendo) {
        this.siguiendo = siguiendo;
    }

    public User getSeguidor() {
        return seguidor;
    }

    public void setSeguidor(User user) {
        this.seguidor = user;
    }

    public User getSeguido() {
        return seguido;
    }

    public void setSeguido(User user) {
        this.seguido = user;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Seguimiento seguimiento = (Seguimiento) o;
        if(seguimiento.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, seguimiento.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Seguimiento{" +
            "id=" + id +
            ", fecha='" + fecha + "'" +
            ", siguiendo='" + siguiendo + "'" +
            '}';
    }
}
