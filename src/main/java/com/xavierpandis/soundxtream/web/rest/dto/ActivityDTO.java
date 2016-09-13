package com.xavierpandis.soundxtream.web.rest.dto;

import com.xavierpandis.soundxtream.domain.Playlist;
import com.xavierpandis.soundxtream.domain.Song;
import com.xavierpandis.soundxtream.domain.Song_user;

import java.time.ZonedDateTime;

/**
 * Created by Xavi on 20/04/2016.
 */
public class ActivityDTO {
    private String type;
    private Playlist playlist;
    private Song song;
    private ZonedDateTime date;
    private Song_user shareTrack;

    public Song_user getShareTrack() {
        return shareTrack;
    }

    public void setShareTrack(Song_user shareTrack) {
        this.shareTrack = shareTrack;
    }

    public ZonedDateTime getDate() {
        return date;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Playlist getPlaylist() {
        return playlist;
    }

    public void setPlaylist(Playlist playlist) {
        this.playlist = playlist;
    }

    public Song getSong() {
        return song;
    }

    public void setSong(Song song) {
        this.song = song;
    }
}
