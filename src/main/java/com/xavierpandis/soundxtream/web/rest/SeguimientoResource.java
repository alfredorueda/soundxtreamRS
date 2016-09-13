package com.xavierpandis.soundxtream.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.xavierpandis.soundxtream.domain.Seguimiento;
import com.xavierpandis.soundxtream.domain.Song_user;
import com.xavierpandis.soundxtream.domain.User;
import com.xavierpandis.soundxtream.repository.SeguimientoRepository;
import com.xavierpandis.soundxtream.repository.UserRepository;
import com.xavierpandis.soundxtream.repository.search.SeguimientoSearchRepository;
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
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Seguimiento.
 */
@RestController
@RequestMapping("/api")
public class SeguimientoResource {

    private final Logger log = LoggerFactory.getLogger(SeguimientoResource.class);

    @Inject
    private SeguimientoRepository seguimientoRepository;

    @Inject
    private SeguimientoSearchRepository seguimientoSearchRepository;

    @Inject
    private UserRepository userRepository;

    /**
     * POST  /seguimientos -> Create a new seguimiento.
     */
    @RequestMapping(value = "/seguimientos",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Seguimiento> createSeguimiento(@RequestBody Seguimiento seguimiento) throws URISyntaxException {
        log.debug("REST request to save Seguimiento : {}", seguimiento);
        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get();

        String seguido = seguimiento.getSeguido().getLogin();

        Seguimiento exist = seguimientoRepository.findExistSeguimiento(user.getLogin(),seguido);
        if(exist != null){
            if(exist.getSiguiendo() == null || exist.getSiguiendo() == false){
                exist.setSiguiendo(true);
            }
            else{
                exist.setSiguiendo(false);
            }
            return updateSeguimiento(exist);
        }

        ZonedDateTime today = ZonedDateTime.now();
        seguimiento.setFecha(today);
        seguimiento.setSeguidor(user);
        seguimiento.setSeguido(seguimiento.getSeguido());
        seguimiento.setSiguiendo(true);

        if (seguimiento.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("seguimiento", "idexists", "A new seguimiento cannot already have an ID")).body(null);
        }
        Seguimiento result = seguimientoRepository.save(seguimiento);
        seguimientoSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/seguimientos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("seguimiento", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /seguimientos -> Updates an existing seguimiento.
     */
    @RequestMapping(value = "/seguimientos",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Seguimiento> updateSeguimiento(@RequestBody Seguimiento seguimiento) throws URISyntaxException {
        log.debug("REST request to update Seguimiento : {}", seguimiento);
        if (seguimiento.getId() == null) {
            return createSeguimiento(seguimiento);
        }
        Seguimiento result = seguimientoRepository.save(seguimiento);
        seguimientoSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("seguimiento", seguimiento.getId().toString()))
            .body(result);
    }

    /**
     * GET  /seguimientos -> get all the seguimientos.
     */
    @RequestMapping(value = "/seguimientos",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Seguimiento>> getAllSeguimientos(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of Seguimientos");
        Page<Seguimiento> page = seguimientoRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/seguimientos");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /seguimientos/:id -> get the "id" seguimiento.
     */
    @RequestMapping(value = "/seguimientos/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Seguimiento> getSeguimiento(@PathVariable Long id) {
        log.debug("REST request to get Seguimiento : {}", id);
        Seguimiento seguimiento = seguimientoRepository.findOne(id);
        return Optional.ofNullable(seguimiento)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /seguimientos/:id -> delete the "id" seguimiento.
     */
    @RequestMapping(value = "/seguimientos/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteSeguimiento(@PathVariable Long id) {
        log.debug("REST request to delete Seguimiento : {}", id);
        seguimientoRepository.delete(id);
        seguimientoSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("seguimiento", id.toString())).build();
    }

    /**
     * SEARCH  /_search/seguimientos/:query -> search for the seguimiento corresponding
     * to the query.
     */
    @RequestMapping(value = "/_search/seguimientos/{query:.+}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Seguimiento> searchSeguimientos(@PathVariable String query) {
        log.debug("REST request to search Seguimientos for query {}", query);
        return StreamSupport
            .stream(seguimientoSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
