package com.xavierpandis.soundxtream.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Xavi on 27/10/2016.
 */

@Service
@Transactional
public class DateDiffService {

    public Map<String, Long> diffDatesMap(ZonedDateTime now, ZonedDateTime secondDate){

        ZonedDateTime tempDate = ZonedDateTime.from(secondDate);

        long years = tempDate.until(now, ChronoUnit.YEARS);
        tempDate = tempDate.plusYears(years);

        long months = tempDate.until(now, ChronoUnit.MONTHS);
        tempDate = tempDate.plusMonths(months);

        long weeks = tempDate.until(now, ChronoUnit.WEEKS);
        tempDate = tempDate.plusWeeks(weeks);

        long days = tempDate.until(now, ChronoUnit.DAYS);
        tempDate = tempDate.plusDays(days);

        long hours = tempDate.until(now, ChronoUnit.HOURS);
        tempDate = tempDate.plusHours(hours);

        long minutes = tempDate.until(now, ChronoUnit.MINUTES);
        tempDate = tempDate.plusMinutes(minutes);

        long seconds = tempDate.until(now, ChronoUnit.SECONDS);
        tempDate = tempDate.plusSeconds(seconds);

        Map<String, Long> map = new HashMap<>();

        map.put("years", years);
        map.put("months", months);
        map.put("weeks", weeks);
        map.put("days", days);
        map.put("hours", hours);
        map.put("minutes", minutes);
        map.put("seconds", seconds);

        return map;
    }

}
