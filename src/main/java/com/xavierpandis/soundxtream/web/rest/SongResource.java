package com.xavierpandis.soundxtream.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.xavierpandis.soundxtream.domain.Playlist;
import com.xavierpandis.soundxtream.domain.Song;
import com.xavierpandis.soundxtream.domain.Song_user;
import com.xavierpandis.soundxtream.domain.User;
import com.xavierpandis.soundxtream.repository.*;
import com.xavierpandis.soundxtream.repository.search.SongSearchRepository;
import com.xavierpandis.soundxtream.security.SecurityUtils;
import com.xavierpandis.soundxtream.service.DateDiffService;
import com.xavierpandis.soundxtream.web.rest.dto.SongDTO;
import com.xavierpandis.soundxtream.web.rest.util.HeaderUtil;
import com.xavierpandis.soundxtream.web.rest.util.PaginationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.inject.Inject;
import javax.validation.Valid;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * REST controller for managing Song.
 */
@RestController
@RequestMapping("/api")
public class SongResource {

    private final Logger log = LoggerFactory.getLogger(SongResource.class);

    @Inject
    private SongRepository songRepository;

    @Inject
    private SeguimientoRepository seguimientoRepository;

    @Inject
    private SongSearchRepository songSearchRepository;

    @Inject
    private UserRepository userRepository;

    @Inject
    private Song_userRepository song_userRepository;

    @Inject
    private StyleRepository styleRepository;

    @Inject
    private DateDiffService dateDiffService;

    @Inject
    private PlaylistRepository playlistRepository;

    /**
     * POST  /songs -> Create a new song.
     */
    @RequestMapping(value = "/songs",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Song> createSong(@Valid @RequestBody Song song) throws URISyntaxException {
        log.debug("REST request to save Song : {}", song);
        if (song.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("song", "idexists", "A new song cannot already have an ID")).body(null);
        }
        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get();


        String nameFinal = checkAccessURL(song.getAccess_url(), song);

        song.setAccess_url(nameFinal);

        if(song.getArtwork() == null){
            song.setArtwork("/assets/images/default_image.jpg");
        }

        song.setUser(user);
        ZonedDateTime today = ZonedDateTime.now();
        song.setDate_posted(today);
        if(song.getArtwork() == null){
            song.setArtwork("uploads/no_image.jpg");
        }
        Song result = songRepository.save(song);
        songSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/songs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("song", result.getId().toString()))
            .body(result);
    }

    public String checkAccessURL(String name,Song song){
        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get();

        Song exist = songRepository.findOneByAccessUrl(song.getAccess_url(), user.getLogin());

        if(exist != null){
            String nextCheck = song.getAccess_url()+"1";
            song.setAccess_url(nextCheck);
            checkAccessURL(nextCheck,song);
        }
        return song.getAccess_url();
    }

    /**
     * PUT  /songs -> Updates an existing song.
     */
    @RequestMapping(value = "/songs",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Song> updateSong(@Valid @RequestBody Song song) throws URISyntaxException {
        log.debug("REST request to update Song : {}", song);
        if (song.getId() == null) {
            return createSong(song);
        }
        if(song.getArtwork() == null){
            song.setArtwork("uploads/no_image.jpg");
        }
        ZonedDateTime today = ZonedDateTime.now();
        song.setDate_posted(today);
        Song result = songRepository.save(song);
        songSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("song", song.getId().toString()))
            .body(result);
    }

    @RequestMapping(value = "/songsApp",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<SongDTO>> getSongsApp(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of Songs");
        Page<Song> page = songRepository.findAll(pageable);

        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get();

        List<SongDTO> listSongDTO = new ArrayList<>();

        for(Song song:page.getContent()){
            listSongDTO.add(getInfoSong(song,user));
        }


        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/songs");
        return new ResponseEntity<>(listSongDTO, headers, HttpStatus.OK);
    }

    /**
     * GET  /songs -> get all the songs.
     */
    @RequestMapping(value = "/songs",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<SongDTO>> getAllSongs(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of Songs");
        Page<Song> page = songRepository.findByUserIsCurrentUser(pageable);

        List<SongDTO> listSongDTO = new ArrayList<>();
        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get();
        ZonedDateTime now = ZonedDateTime.now();

        for(Song song:page.getContent()){
            Song_user song_user = song_userRepository.findExistUserLiked(song.getId(),user.getLogin());
            SongDTO songDTO = new SongDTO();

            songDTO.setTimeAfterUpload(dateDiffService.diffDatesMap(now, song.getDate_posted()));

            songDTO.setSong(song);

            if(song_user == null || song_user.getLiked() == null || !song_user.getLiked()){
                songDTO.setLiked(false);
            }
            else{
                songDTO.setLiked(true);
            }

            if(song_user == null || song_user.getShared() == null || !song_user.getShared()){
                songDTO.setShared(false);
            }
            else{
                songDTO.setShared(true);
            }

            listSongDTO.add(songDTO);

            int countLikes = song_userRepository.findTotalLikes(song.getId());
            int countShares = song_userRepository.findTotalShares(song.getId());
            songDTO.setTotalLikes(countLikes);
            songDTO.setTotalShares(countShares);
        }

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/songs");
        return new ResponseEntity<>(listSongDTO, headers, HttpStatus.OK);
    }

    /**
     * GET  /songs/:id -> get the "id" song.
     */
    @RequestMapping(value = "/songs/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<SongDTO> getSong(@PathVariable Long id) {
        log.debug("REST request to get Song : {}", id);
        Song song = songRepository.findOne(id);

        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get();
        SongDTO songDTO = new SongDTO();
        songDTO.setSong(song);

        Song_user song_user = song_userRepository.findExistUserLiked(song.getId(),user.getLogin());

        if(song_user == null || song_user.getLiked() == null || !song_user.getLiked()){
            songDTO.setLiked(false);
        }
        else{
            songDTO.setLiked(true);
        }

        if(song_user == null || song_user.getShared() == null || !song_user.getShared()){
            songDTO.setShared(false);
        }
        else{
            songDTO.setShared(true);
        }

        int countLikes = song_userRepository.findTotalLikes(song.getId());
        int countShares = song_userRepository.findTotalShares(song.getId());
        songDTO.setTotalLikes(countLikes);
        songDTO.setTotalShares(countShares);

        return Optional.ofNullable(songDTO)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /songs/:id -> delete the "id" song.
     */
    @RequestMapping(value = "/songs/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteSong(@PathVariable Long id) {
        log.debug("REST request to delete Song : {}", id);
        Song song = songRepository.findOne(id);
        try{
            String rootDir = "./src/main/webapp/";

            File file2 = new File(rootDir + song.getArtwork());
            File file1 = new File(rootDir + song.getUrl());

            if(file1.delete()){
                log.debug("SONG FILE " + file1.getName() + " is deleted!");
            }else{
                log.debug("Delete operation is failed.");
            }
            if(file2.delete()){
                log.debug("SONG ARTWORK" + file2.getName() + " is deleted!");
            }
            else{
                log.debug("Delete operation is failed.");
            }

        }catch(Exception e){

            e.printStackTrace();

        }

        List<Playlist> playlists = playlistRepository.findAllWithEagerRelationships();
        List<Playlist> playlistWithSong = new ArrayList<>();

        for(Playlist playlist:playlists){

            List<Song> songsPlaylist = playlist.getSongs();

            songsPlaylist.removeIf(song1 -> song.getId().equals(id));
            for(Song song2:playlist.getSongs()){
                if(song.getId() == id){
                    playlistWithSong.add(playlist);
                }
            }

            playlist.setSongs(songsPlaylist);
            playlistRepository.save(playlist);
        }

        songRepository.delete(id);
        songSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("song", id.toString())).build();
    }


    /**
     * SEARCH  /_search/songs/:query -> search for the song corresponding
     * to the query.
     */
    @RequestMapping(value = "/_search/songs/{query:.+}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Song> searchSongs(@PathVariable String query) {
        log.debug("REST request to search Songs for query {}", query);
        return StreamSupport
            .stream(songSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

    public File convert(MultipartFile file) throws IOException {
        File trackFile = new File(file.getOriginalFilename());
        trackFile.createNewFile();
        FileOutputStream fos = new FileOutputStream(trackFile);
        fos.write(file.getBytes());
        fos.close();
        return trackFile;
    }

    @RequestMapping(value = "/upload",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public void handleFileUpload(@RequestParam("file") MultipartFile file, @RequestParam("name") String name) {
        log.debug("REST request to handleFileUpload");

        File theDir = new File("./src/main/webapp/uploads");

        byte[] bytes;

        String nameSong = "";

        try {

            if (!theDir.exists()) {
                System.out.println("creating directory: /uploads");
                boolean result = false;

                try{
                    theDir.mkdir();
                    result = true;
                }
                catch(SecurityException se){
                    //handle it
                }
                if(result) {
                    System.out.println("DIR created");
                }
            }

            //Get name of file
            nameSong = name;

            //Create new file in path
            BufferedOutputStream stream =
                new BufferedOutputStream(new FileOutputStream(new File("./src/main/webapp/uploads/"+nameSong)));

            stream.write(file.getBytes());
            stream.close();
            log.debug("You successfully uploaded " + file.getName() + "!");
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    public SongDTO getInfoSong(Song song, User user){
        SongDTO songDTO = new SongDTO();
        songDTO.setSong(song);

        Song_user song_user = song_userRepository.findExistUserLiked(song.getId(),user.getLogin());

        if(song_user == null || song_user.getLiked() == null || !song_user.getLiked()){
            songDTO.setLiked(false);
        }
        else{
            songDTO.setLiked(true);
        }

        if(song_user == null || song_user.getShared() == null || !song_user.getShared()){
            songDTO.setShared(false);
        }
        else{
            songDTO.setShared(true);
        }

        int countLikes = song_userRepository.findTotalLikes(song.getId());
        int countShares = song_userRepository.findTotalShares(song.getId());
        songDTO.setTotalLikes(countLikes);
        songDTO.setTotalShares(countShares);

        return songDTO;
    }

    @RequestMapping(value = "/songs/newest/user/{login}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<SongDTO>> firstNineSongs(@PathVariable String login)
        throws URISyntaxException {
        log.debug("REST request to get a page of Songs");
        Pageable topTen = new PageRequest(0, 9);
        Page<Song> page = songRepository.findByUserTracks(login,topTen);

        List<SongDTO> listSongDTO = new ArrayList<>();
        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get();

        for(Song song:page.getContent()){
            Song_user song_user = song_userRepository.findExistUserLiked(song.getId(),user.getLogin());
            SongDTO songDTO = new SongDTO();

            songDTO.setSong(song);

            if(song_user == null || song_user.getLiked() == null || !song_user.getLiked()){
                songDTO.setLiked(false);
            }
            else{
                songDTO.setLiked(true);
            }

            if(song_user == null || song_user.getShared() == null || !song_user.getShared()){
                songDTO.setShared(false);
            }
            else{
                songDTO.setShared(true);
            }

            listSongDTO.add(songDTO);

            int countLikes = song_userRepository.findTotalLikes(song.getId());
            int countShares = song_userRepository.findTotalShares(song.getId());
            songDTO.setTotalLikes(countLikes);
            songDTO.setTotalShares(countShares);
        }

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/songs");
        return new ResponseEntity<>(listSongDTO, headers, HttpStatus.OK);
    }

    /**
     * GET  /songs/{login} -> get all the songs of user.
     */
    @RequestMapping(value = "/songs/user/{login}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<SongDTO>> getAllSongs(@PathVariable String login, Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of Songs");
        Page<Song> page = songRepository.findByUserTracks(login,pageable);

        List<SongDTO> listSongDTO = new ArrayList<>();
        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get();

        for(Song song:page.getContent()){
            Song_user song_user = song_userRepository.findExistUserLiked(song.getId(),user.getLogin());
            SongDTO songDTO = new SongDTO();

            songDTO.setSong(song);

            if(song_user == null || song_user.getLiked() == null || !song_user.getLiked()){
                songDTO.setLiked(false);
            }
            else{
                songDTO.setLiked(true);
            }

            if(song_user == null || song_user.getShared() == null || !song_user.getShared()){
                songDTO.setShared(false);
            }
            else{
                songDTO.setShared(true);
            }

            listSongDTO.add(songDTO);

            int countLikes = song_userRepository.findTotalLikes(song.getId());
            int countShares = song_userRepository.findTotalShares(song.getId());
            songDTO.setTotalLikes(countLikes);
            songDTO.setTotalShares(countShares);
        }

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/songs");
        return new ResponseEntity<>(listSongDTO, headers, HttpStatus.OK);
    }

    @RequestMapping(value = "/trackUrl/{accessUrl}/by/{user}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<SongDTO> getTrackByAccessUrl(@PathVariable String accessUrl, @PathVariable String user) {
        log.debug("REST request to get Track : {}", accessUrl);
        Song song = songRepository.findOneByAccessUrl(accessUrl,user);

        User userIn = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get();
        SongDTO songDTO = new SongDTO();
        songDTO.setSong(song);

        Song_user song_user = song_userRepository.findExistUserLiked(song.getId(),userIn.getLogin());

        if(song_user == null || song_user.getLiked() == null || !song_user.getLiked()){
            songDTO.setLiked(false);
        }
        else{
            songDTO.setLiked(true);
        }

        if(song_user == null || song_user.getShared() == null || !song_user.getShared()){
            songDTO.setShared(false);
        }
        else{
            songDTO.setShared(true);
        }

        int countLikes = song_userRepository.findTotalLikes(song.getId());
        int countShares = song_userRepository.findTotalShares(song.getId());
        songDTO.setTotalLikes(countLikes);
        songDTO.setTotalShares(countShares);

        return Optional.ofNullable(songDTO)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @RequestMapping(value = "/trackByUser",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Song>> getTracksByUser()
        throws URISyntaxException {
        log.debug("REST request to get a page of Tracks");
        List<Song> page = songRepository.findByUserIsCurrentUser();
        return new ResponseEntity<>(page, HttpStatus.OK);
    }

    @RequestMapping(value = "/tracksPlayer/user/logged",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<SongDTO>> tracksPlayerUser(){
        List<Song> listPlayer = songRepository.findByUserIsCurrentUser();

        List<SongDTO> listSongDTO = new ArrayList<>();
        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get();
        ZonedDateTime now = ZonedDateTime.now();

        for(Song song:listPlayer){
            Song_user song_user = song_userRepository.findExistUserLiked(song.getId(),user.getLogin());
            SongDTO songDTO = new SongDTO();

            songDTO.setTimeAfterUpload(dateDiffService.diffDatesMap(now, song.getDate_posted()));

            songDTO.setSong(song);

            if(song_user == null || song_user.getLiked() == null || !song_user.getLiked()){
                songDTO.setLiked(false);
            }
            else{
                songDTO.setLiked(true);
            }

            if(song_user == null || song_user.getShared() == null || !song_user.getShared()){
                songDTO.setShared(false);
            }
            else{
                songDTO.setShared(true);
            }

            listSongDTO.add(songDTO);

            int countLikes = song_userRepository.findTotalLikes(song.getId());
            int countShares = song_userRepository.findTotalShares(song.getId());
            songDTO.setTotalLikes(countLikes);
            songDTO.setTotalShares(countShares);
        }

        return new ResponseEntity<>(listSongDTO, HttpStatus.OK);
    }


}
