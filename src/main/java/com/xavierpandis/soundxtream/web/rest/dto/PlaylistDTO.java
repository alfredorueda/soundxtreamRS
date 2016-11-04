package com.xavierpandis.soundxtream.web.rest.dto;

import com.xavierpandis.soundxtream.domain.Playlist;
import com.xavierpandis.soundxtream.domain.Song;

/**
 * Created by Xavi on 30/10/2016.
 */
public class PlaylistDTO {

    private Playlist playlist;
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
}
