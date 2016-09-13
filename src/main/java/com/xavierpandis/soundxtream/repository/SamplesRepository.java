package com.xavierpandis.soundxtream.repository;

import com.xavierpandis.soundxtream.domain.Samples;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Samples entity.
 */
public interface SamplesRepository extends JpaRepository<Samples,Long> {

    @Query("select samples from Samples samples where samples.user.login = ?#{principal.username}")
    List<Samples> findByUserIsCurrentUser();

}
