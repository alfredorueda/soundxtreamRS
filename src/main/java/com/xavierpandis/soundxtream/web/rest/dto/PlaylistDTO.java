package com.xavierpandis.soundxtream.web.rest.dto;

import com.xavierpandis.soundxtream.domain.Playlist;
import com.xavierpandis.soundxtream.domain.Song;
import com.xavierpandis.soundxtream.domain.User;

import java.util.List;
import java.util.Set;

/**
 * Created by Xavi on 30/10/2016.
 */
public class PlaylistDTO {

    private Playlist playlist;
    private Set<User> usersLiked;
    private Set<User> usersShared;
    private Boolean liked;
    private int totalLikes;
    private Boolean shared;
    private int totalShares;

    public Playlist getPlaylist() {
        return playlist;
    }

    public void setPlaylist(Playlist playlist) {
        this.playlist = playlist;
    }

    public Boolean getLiked() {
        return liked;
    }

    public void setLiked(Boolean liked) {
        this.liked = liked;
    }

    public int getTotalLikes() {
        return totalLikes;
    }

    public void setTotalLikes(int totalLikes) {
        this.totalLikes = totalLikes;
    }

    public Boolean getShared() {
        return shared;
    }

    public void setShared(Boolean shared) {
        this.shared = shared;
    }

    public int getTotalShares() {
        return totalShares;
    }

    public void setTotalShares(int totalShares) {
        this.totalShares = totalShares;
    }

    public Set<User> getUsersLiked() {
        return usersLiked;
    }

    public void setUsersLiked(Set<User> usersLiked) {
        this.usersLiked = usersLiked;
    }

    public Set<User> getUsersShared() {
        return usersShared;
    }

    public void setUsersShared(Set<User> usersShared) {
        this.usersShared = usersShared;
    }
}
