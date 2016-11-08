package com.xavierpandis.soundxtream.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.xavierpandis.soundxtream.domain.*;
import com.xavierpandis.soundxtream.repository.PlaylistRepository;
import com.xavierpandis.soundxtream.repository.Playlist_userRepository;
import com.xavierpandis.soundxtream.repository.UserRepository;
import com.xavierpandis.soundxtream.repository.search.Playlist_userSearchRepository;
import com.xavierpandis.soundxtream.security.SecurityUtils;
import com.xavierpandis.soundxtream.web.rest.util.HeaderUtil;
import com.xavierpandis.soundxtream.web.rest.util.PaginationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Playlist_user.
 */
@RestController
@RequestMapping("/api")
public class Playlist_userResource {

    private final Logger log = LoggerFactory.getLogger(Playlist_userResource.class);

    @Inject
    private Playlist_userRepository playlist_userRepository;

    @Inject
    private Playlist_userSearchRepository playlist_userSearchRepository;

    @Inject
    private UserRepository userRepository;

    @Inject
    private PlaylistRepository playlistRepository;

    /**
     * POST  /playlist_users -> Create a new playlist_user.
     */
    @RequestMapping(value = "/playlist_users",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Playlist_user> createPlaylist_user(@RequestBody Playlist_user playlist_user) throws URISyntaxException {
        log.debug("REST request to save Playlist_user : {}", playlist_user);
        if (playlist_user.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("playlist_user", "idexists", "A new playlist_user cannot already have an ID")).body(null);
        }
        Playlist_user result = playlist_userRepository.save(playlist_user);
        playlist_userSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/playlist_users/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("playlist_user", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /playlist_users -> Updates an existing playlist_user.
     */
    @RequestMapping(value = "/playlist_users",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Playlist_user> updatePlaylist_user(@RequestBody Playlist_user playlist_user) throws URISyntaxException {
        log.debug("REST request to update Playlist_user : {}", playlist_user);
        if (playlist_user.getId() == null) {
            return createPlaylist_user(playlist_user);
        }
        Playlist_user result = playlist_userRepository.save(playlist_user);
        playlist_userSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("playlist_user", playlist_user.getId().toString()))
            .body(result);
    }

    /**
     * GET  /playlist_users -> get all the playlist_users.
     */
    @RequestMapping(value = "/playlist_users",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Playlist_user>> getAllPlaylist_users(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of Playlist_users");
        //Page<Playlist_user> page = playlist_userRepository.findAll(pageable);
        Page<Playlist_user> page = playlist_userRepository.findByUserIsCurrentUser(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/playlist_users");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /playlist_users/:id -> get the "id" playlist_user.
     */
    @RequestMapping(value = "/playlist_users/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Playlist_user> getPlaylist_user(@PathVariable Long id) {
        log.debug("REST request to get Playlist_user : {}", id);
        Playlist_user playlist_user = playlist_userRepository.findOne(id);
        return Optional.ofNullable(playlist_user)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /playlist_users/:id -> delete the "id" playlist_user.
     */
    @RequestMapping(value = "/playlist_users/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deletePlaylist_user(@PathVariable Long id) {
        log.debug("REST request to delete Playlist_user : {}", id);
        playlist_userRepository.delete(id);
        playlist_userSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("playlist_user", id.toString())).build();
    }

    /**
     * SEARCH  /_search/playlist_users/:query -> search for the playlist_user corresponding
     * to the query.
     */
    @RequestMapping(value = "/_search/playlist_users/{query:.+}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Playlist_user> searchPlaylist_users(@PathVariable String query) {
        log.debug("REST request to search Playlist_users for query {}", query);
        return StreamSupport
            .stream(playlist_userSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

    @RequestMapping(value = "/playlist_users/{id}/share",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Playlist_user> sharePlaylist(@PathVariable Long id) throws URISyntaxException {
        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get();
        Playlist_user exist = playlist_userRepository.findExistUserLiked(id,user.getLogin());

        if(exist != null){
            ZonedDateTime today = ZonedDateTime.now();
            exist.setSharedDate(today);
            if(exist.getShared() == null || exist.getShared() == false){
                exist.setShared(true);
            }else{
                exist.setShared(false);
            }
            return updatePlaylist_user(exist);
        }

        Playlist playlist = playlistRepository.findOne(id);

        ZonedDateTime today = ZonedDateTime.now();
        Playlist_user playlist_user = new Playlist_user();
        playlist_user.setSharedDate(today);
        playlist_user.setUser(user);
        playlist_user.setPlaylist(playlist);
        playlist_user.setShared(true);

        Playlist_user result = playlist_userRepository.save(playlist_user);
        return ResponseEntity.created(new URI("/api/playlist_users/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("playlist_users", result.getId().toString()))
            .body(result);
    }

    @RequestMapping(value = "/playlist_users/{id}/like",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Playlist_user> likePlaylist(@PathVariable Long id) throws URISyntaxException {
        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get();
        Playlist_user exist = playlist_userRepository.findExistUserLiked(id,user.getLogin());

        if(exist != null){
            ZonedDateTime today = ZonedDateTime.now();
            exist.setLikedDate(today);
            if(exist.getLiked() == null || exist.getLiked() == false){
                exist.setLiked(true);
            }else{
                exist.setLiked(false);
            }
            return updatePlaylist_user(exist);
        }

        Playlist playlist = playlistRepository.findOne(id);

        ZonedDateTime today = ZonedDateTime.now();
        Playlist_user playlist_user = new Playlist_user();
        playlist_user.setLikedDate(today);
        playlist_user.setUser(user);
        playlist_user.setPlaylist(playlist);
        playlist_user.setLiked(true);

        Playlist_user result = playlist_userRepository.save(playlist_user);
        return ResponseEntity.created(new URI("/api/playlist_users/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("playlist_users", result.getId().toString()))
            .body(result);
    }

    @RequestMapping(value = "/playlist/likesUser/{login}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Playlist_user>> getPlaylistsLikesUser(@PathVariable String login,Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of Song_users");
        Page<Playlist_user> page = playlist_userRepository.findLikesUser(login, pageable);
        List<Playlist_user> likes = new ArrayList<>();

        for(Playlist_user playlist_user:page.getContent()){
            if(playlist_user.getLiked() == true){
                likes.add(playlist_user);
            }
        }

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/likesUser");
        return new ResponseEntity<>(likes, headers, HttpStatus.OK);
    }
}
