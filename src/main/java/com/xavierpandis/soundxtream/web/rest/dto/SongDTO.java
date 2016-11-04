package com.xavierpandis.soundxtream.web.rest.dto;

import com.xavierpandis.soundxtream.domain.Song;

import java.util.HashMap;
import java.util.Map;

public class SongDTO {
    private Song song;
    private Boolean liked;
    private int totalLikes;
    private Boolean shared;
    private int totalShares;

    private Map<String, Long> timeAfterUpload = new HashMap<String, Long>();

    public Song getSong() {
        return song;
    }

    public void setSong(Song song) {
        this.song = song;
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

    public Map<String, Long> getTimeAfterUpload() {
        return timeAfterUpload;
    }

    public void setTimeAfterUpload(Map<String, Long> timeAfterUpload) {
        this.timeAfterUpload = timeAfterUpload;
    }
}
