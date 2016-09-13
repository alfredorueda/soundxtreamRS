package com.xavierpandis.soundxtream.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.xavierpandis.soundxtream.domain.Samples;
import com.xavierpandis.soundxtream.repository.SamplesRepository;
import com.xavierpandis.soundxtream.repository.search.SamplesSearchRepository;
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
 * REST controller for managing Samples.
 */
@RestController
@RequestMapping("/api")
public class SamplesResource {

    private final Logger log = LoggerFactory.getLogger(SamplesResource.class);
        
    @Inject
    private SamplesRepository samplesRepository;
    
    @Inject
    private SamplesSearchRepository samplesSearchRepository;
    
    /**
     * POST  /sampless -> Create a new samples.
     */
    @RequestMapping(value = "/sampless",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Samples> createSamples(@Valid @RequestBody Samples samples) throws URISyntaxException {
        log.debug("REST request to save Samples : {}", samples);
        if (samples.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("samples", "idexists", "A new samples cannot already have an ID")).body(null);
        }
        Samples result = samplesRepository.save(samples);
        samplesSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/sampless/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("samples", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /sampless -> Updates an existing samples.
     */
    @RequestMapping(value = "/sampless",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Samples> updateSamples(@Valid @RequestBody Samples samples) throws URISyntaxException {
        log.debug("REST request to update Samples : {}", samples);
        if (samples.getId() == null) {
            return createSamples(samples);
        }
        Samples result = samplesRepository.save(samples);
        samplesSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("samples", samples.getId().toString()))
            .body(result);
    }

    /**
     * GET  /sampless -> get all the sampless.
     */
    @RequestMapping(value = "/sampless",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Samples>> getAllSampless(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of Sampless");
        Page<Samples> page = samplesRepository.findAll(pageable); 
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/sampless");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /sampless/:id -> get the "id" samples.
     */
    @RequestMapping(value = "/sampless/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Samples> getSamples(@PathVariable Long id) {
        log.debug("REST request to get Samples : {}", id);
        Samples samples = samplesRepository.findOne(id);
        return Optional.ofNullable(samples)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /sampless/:id -> delete the "id" samples.
     */
    @RequestMapping(value = "/sampless/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteSamples(@PathVariable Long id) {
        log.debug("REST request to delete Samples : {}", id);
        samplesRepository.delete(id);
        samplesSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("samples", id.toString())).build();
    }

    /**
     * SEARCH  /_search/sampless/:query -> search for the samples corresponding
     * to the query.
     */
    @RequestMapping(value = "/_search/sampless/{query:.+}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Samples> searchSampless(@PathVariable String query) {
        log.debug("REST request to search Sampless for query {}", query);
        return StreamSupport
            .stream(samplesSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
