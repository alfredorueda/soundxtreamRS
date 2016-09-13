package com.xavierpandis.soundxtream.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.xavierpandis.soundxtream.domain.Style;
import com.xavierpandis.soundxtream.repository.StyleRepository;
import com.xavierpandis.soundxtream.repository.search.StyleSearchRepository;
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
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Style.
 */
@RestController
@RequestMapping("/api")
public class StyleResource {

    private final Logger log = LoggerFactory.getLogger(StyleResource.class);

    @Inject
    private StyleRepository styleRepository;

    @Inject
    private StyleSearchRepository styleSearchRepository;

    /**
     * POST  /styles -> Create a new style.
     */
    @RequestMapping(value = "/styles",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Style> createStyle(@Valid @RequestBody Style style) throws URISyntaxException {
        log.debug("REST request to save Style : {}", style);
        if (style.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("style", "idexists", "A new style cannot already have an ID")).body(null);
        }
        Style result = styleRepository.save(style);
        styleSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/styles/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("style", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /styles -> Updates an existing style.
     */
    @RequestMapping(value = "/styles",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Style> updateStyle(@Valid @RequestBody Style style) throws URISyntaxException {
        log.debug("REST request to update Style : {}", style);
        if (style.getId() == null) {
            return createStyle(style);
        }
        Style result = styleRepository.save(style);
        styleSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("style", style.getId().toString()))
            .body(result);
    }

    /**
     * GET  /styles -> get all the styles.
     */
    @RequestMapping(value = "/styles",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Style>> getAllStyles(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of Styles");
        Page<Style> page = styleRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/styles");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /styles/:id -> get the "id" style.
     */
    @RequestMapping(value = "/styles/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Style> getStyle(@PathVariable Long id) {
        log.debug("REST request to get Style : {}", id);
        Style style = styleRepository.findOne(id);
        return Optional.ofNullable(style)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /styles/:id -> delete the "id" style.
     */
    @RequestMapping(value = "/styles/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteStyle(@PathVariable Long id) {
        log.debug("REST request to delete Style : {}", id);
        styleRepository.delete(id);
        styleSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("style", id.toString())).build();
    }

    /**
     * SEARCH  /_search/styles/:query -> search for the style corresponding
     * to the query.
     */
    @RequestMapping(value = "/_search/styles/{query:.+}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Style> searchStyles(@PathVariable String query) {
        log.debug("REST request to search Styles for query {}", query);
        return StreamSupport
            .stream(styleSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
