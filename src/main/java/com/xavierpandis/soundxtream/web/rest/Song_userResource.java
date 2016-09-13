package com.xavierpandis.soundxtream.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.xavierpandis.soundxtream.domain.Song;
import com.xavierpandis.soundxtream.domain.Song_user;
import com.xavierpandis.soundxtream.domain.User;
import com.xavierpandis.soundxtream.repository.SongRepository;
import com.xavierpandis.soundxtream.repository.Song_userRepository;
import com.xavierpandis.soundxtream.repository.UserRepository;
import com.xavierpandis.soundxtream.repository.search.Song_userSearchRepository;
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

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * REST controller for managing Song_user.
 */
@RestController
@RequestMapping("/api")
public class Song_userResource {

    private final Logger log = LoggerFactory.getLogger(Song_userResource.class);

    @Inject
    private Song_userRepository song_userRepository;

    @Inject
    private Song_userSearchRepository song_userSearchRepository;

    @Inject
    private SongRepository songRepository;

    @Inject
    private UserRepository userRepository;

    /**
     * POST  /song_users -> Create a new song_user.
     */
    @RequestMapping(value = "/song_users",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Song_user> createSong_user(@RequestBody Song_user song_user) throws URISyntaxException {
        log.debug("REST request to save Song_user : {}", song_user);
        if (song_user.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("song_user", "idexists", "A new song_user cannot already have an ID")).body(null);
        }
        Song_user result = song_userRepository.save(song_user);
        song_userSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/song_users/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("song_user", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /song_users -> Updates an existing song_user.
     */
    @RequestMapping(value = "/song_users",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Song_user> updateSong_user(@RequestBody Song_user song_user) throws URISyntaxException {
        log.debug("REST request to update Song_user : {}", song_user);
        if (song_user.getId() == null) {
            return createSong_user(song_user);
        }
        Song_user result = song_userRepository.save(song_user);
        song_userSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("song_user", song_user.getId().toString()))
            .body(result);
    }

    /**
     * GET  /song_users -> get all the song_users.
     */
    @RequestMapping(value = "/song_users",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Song_user>> getAllSong_users(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of Song_users");
        //Page<Song_user> page = song_userRepository.findAll(pageable);
        Page<Song_user> page = song_userRepository.findByUserIsCurrentUser(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/song_users");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /song_users/:id -> get the "id" song_user.
     */
    @RequestMapping(value = "/song_users/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Song_user> getSong_user(@PathVariable Long id) {
        log.debug("REST request to get Song_user : {}", id);
        Song_user song_user = song_userRepository.findOne(id);
        return Optional.ofNullable(song_user)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /song_users/:id -> delete the "id" song_user.
     */
    @RequestMapping(value = "/song_users/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteSong_user(@PathVariable Long id) {
        log.debug("REST request to delete Song_user : {}", id);
        song_userRepository.delete(id);
        song_userSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("song_user", id.toString())).build();
    }

    /**
     * SEARCH  /_search/song_users/:query -> search for the song_user corresponding
     * to the query.
     */
    @RequestMapping(value = "/_search/song_users/{query:.+}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Song_user> searchSong_users(@PathVariable String query) {
        log.debug("REST request to search Song_users for query {}", query);
        return StreamSupport
            .stream(song_userSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

    @RequestMapping(value = "/song_users/{id}/like",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Song_user> likeSong(@PathVariable Long id) throws URISyntaxException {
        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get();
        Song_user exist = song_userRepository.findExistUserLiked(id,user.getLogin());

        if(exist != null){
            ZonedDateTime today = ZonedDateTime.now();
            exist.setLikedDate(today);
            if(exist.getLiked() == null || exist.getLiked() == false){
                exist.setLiked(true);
            }else{
                exist.setLiked(false);
            }
            return updateSong_user(exist);
        }

        Song song = songRepository.findOne(id);

        ZonedDateTime today = ZonedDateTime.now();
        Song_user song_user = new Song_user();
        song_user.setLikedDate(today);
        song_user.setUser(user);
        song_user.setSong(song);
        song_user.setLiked(true);

        Song_user result = song_userRepository.save(song_user);
        return ResponseEntity.created(new URI("/api/song_users/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("song_user", result.getId().toString()))
            .body(result);
    }

    @RequestMapping(value = "/song_users/{id}/share",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Song_user> shareSong(@PathVariable Long id) throws URISyntaxException {
        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get();
        Song_user exist = song_userRepository.findExistUserLiked(id,user.getLogin());

        if(exist != null){
            ZonedDateTime today = ZonedDateTime.now();
            exist.setSharedDate(today);
            if(exist.getShared() == null || exist.getShared() == false){
                exist.setShared(true);
            }else{
                exist.setShared(false);
            }
            return updateSong_user(exist);
        }

        Song song = songRepository.findOne(id);

        ZonedDateTime today = ZonedDateTime.now();
        Song_user song_user = new Song_user();
        song_user.setSharedDate(today);
        song_user.setUser(user);
        song_user.setSong(song);
        song_user.setShared(true);

        Song_user result = song_userRepository.save(song_user);
        return ResponseEntity.created(new URI("/api/song_users/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("song_user", result.getId().toString()))
            .body(result);
    }

    @RequestMapping(value = "/likesUser/{login}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Song_user>> getLikesUser(@PathVariable String login,Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of Song_users");
        Page<Song_user> page = song_userRepository.findLikesUser(login, pageable);
        List<Song_user> likes = new ArrayList<>();

        for(Song_user song_user:page.getContent()){
            if(song_user.getLiked() == true){
                likes.add(song_user);
            }
        }

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/likesUser");
        return new ResponseEntity<>(likes, headers, HttpStatus.OK);
    }

    @RequestMapping(value = "/totalLikesUser/{login}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public int getTotalLikesUser(@PathVariable String login)
        throws URISyntaxException {
        log.debug("REST request to get a page of Song_users");
        int total = song_userRepository.totalLikesOfUser(login);

        return total;
    }
}
