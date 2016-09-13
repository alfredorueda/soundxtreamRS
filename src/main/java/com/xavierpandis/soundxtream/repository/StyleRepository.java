package com.xavierpandis.soundxtream.repository;

import com.xavierpandis.soundxtream.domain.Style;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data JPA repository for the Style entity.
 */
public interface StyleRepository extends JpaRepository<Style,Long> {

}
