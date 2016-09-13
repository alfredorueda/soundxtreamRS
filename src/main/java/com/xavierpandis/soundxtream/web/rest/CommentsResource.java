package com.xavierpandis.soundxtream.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.xavierpandis.soundxtream.domain.Comments;
import com.xavierpandis.soundxtream.domain.User;
import com.xavierpandis.soundxtream.repository.CommentsRepository;
import com.xavierpandis.soundxtream.repository.UserRepository;
import com.xavierpandis.soundxtream.repository.search.CommentsSearchRepository;
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
import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Comments.
 */
@RestController
@RequestMapping("/api")
public class CommentsResource {

    private final Logger log = LoggerFactory.getLogger(CommentsResource.class);

    @Inject
    private CommentsRepository commentsRepository;

    @Inject
    private CommentsSearchRepository commentsSearchRepository;

    @Inject
    private UserRepository userRepository;

    /**
     * POST  /commentss -> Create a new comments.
     */
    @RequestMapping(value = "/commentss",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Comments> createComments(@Valid @RequestBody Comments comments) throws URISyntaxException {
        log.debug("REST request to save Comments : {}", comments);
        if (comments.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("comments", "idexists", "A new comments cannot already have an ID")).body(null);
        }
        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get();
        comments.setUser(user);
        ZonedDateTime today = ZonedDateTime.now();
        //comments.setDate_comment(today);
        Comments result = commentsRepository.save(comments);
        commentsSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/commentss/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("comments", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /commentss -> Updates an existing comments.
     */
    @RequestMapping(value = "/commentss",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Comments> updateComments(@Valid @RequestBody Comments comments) throws URISyntaxException {
        log.debug("REST request to update Comments : {}", comments);
        if (comments.getId() == null) {
            return createComments(comments);
        }
        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get();
        comments.setUser(user);
        ZonedDateTime today = ZonedDateTime.now();
        comments.setDate_comment(today);
        Comments result = commentsRepository.save(comments);
        commentsSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("comments", comments.getId().toString()))
            .body(result);
    }

    /**
     * GET  /commentss -> get all the commentss.
     */
    @RequestMapping(value = "/commentss",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Comments>> getAllCommentss(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of Commentss");
        Page<Comments> page = commentsRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/commentss");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /commentss/:id -> get the "id" comments.
     */
    @RequestMapping(value = "/commentss/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Comments> getComments(@PathVariable Long id) {
        log.debug("REST request to get Comments : {}", id);
        Comments comments = commentsRepository.findOne(id);
        return Optional.ofNullable(comments)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /commentss/:id -> delete the "id" comments.
     */
    @RequestMapping(value = "/commentss/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteComments(@PathVariable Long id) {
        log.debug("REST request to delete Comments : {}", id);
        commentsRepository.delete(id);
        commentsSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("comments", id.toString())).build();
    }

    /**
     * SEARCH  /_search/commentss/:query -> search for the comments corresponding
     * to the query.
     */
    @RequestMapping(value = "/_search/commentss/{query:.+}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Comments> searchCommentss(@PathVariable String query) {
        log.debug("REST request to search Commentss for query {}", query);
        return StreamSupport
            .stream(commentsSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

    @RequestMapping(value = "/comments_song/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Comments>> getCommentsSong(@PathVariable Long id,Pageable pageable) throws URISyntaxException {
        log.debug("REST request to get Comments : {}", id);

        Page<Comments> comments = commentsRepository.findCommentsBySong(id,pageable);

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(comments, "/api/commentss");
        return new ResponseEntity<>(comments.getContent(), headers, HttpStatus.OK);
    }

}
