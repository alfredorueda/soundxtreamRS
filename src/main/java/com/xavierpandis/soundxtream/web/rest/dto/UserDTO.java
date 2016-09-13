package com.xavierpandis.soundxtream.web.rest.dto;

import com.xavierpandis.soundxtream.domain.Authority;
import com.xavierpandis.soundxtream.domain.Seguimiento;
import com.xavierpandis.soundxtream.domain.User;

import org.hibernate.internal.util.type.PrimitiveWrapperHelper;
import org.hibernate.validator.constraints.Email;

import javax.validation.constraints.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
/**
 * A DTO representing a user, with his authorities.
 */
public class UserDTO {

    public static final int PASSWORD_MIN_LENGTH = 5;
    public static final int PASSWORD_MAX_LENGTH = 100;

    @Pattern(regexp = "^[a-z0-9]*$")
    @NotNull
    @Size(min = 1, max = 50)
    private String login;

    @NotNull
    @Size(min = PASSWORD_MIN_LENGTH, max = PASSWORD_MAX_LENGTH)
    private String password;

    @Size(max = 50)
    private String firstName;

    @Size(max = 50)
    private String lastName;

    @Email
    @Size(min = 5, max = 100)
    private String email;

    private boolean activated = false;

    private String user_image;

    private String description;

    private Boolean followedByUser;

    private int totalFollowers;

    private int totalFollowings;

    private List<User> followingUsers;

    private List<User> followersUsers;

    @Size(min = 2, max = 5)
    private String langKey;

    private Set<String> authorities;

    public UserDTO() {
    }

    public UserDTO(User user) {
        this(user.getLogin(), null, user.getFirstName(), user.getLastName(),
            user.getEmail(), user.getActivated(), user.getUser_image(), user.getDescription(), user.getLangKey(),
            user.getAuthorities().stream().map(Authority::getName)
                .collect(Collectors.toSet()));
    }

    public UserDTO(String login, String password, String firstName, String lastName,
        String email, boolean activated, String user_image,String description, String langKey, Set<String> authorities) {

        this.login = login;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.activated = activated;
        this.langKey = langKey;
        this.authorities = authorities;
        this.user_image = user_image;
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setActivated(boolean activated) {
        this.activated = activated;
    }

    public void setUser_image(String user_image) {
        this.user_image = user_image;
    }

    public void setLangKey(String langKey) {
        this.langKey = langKey;
    }

    public void setAuthorities(Set<String> authorities) {
        this.authorities = authorities;
    }

    public String getPassword() {
        return password;
    }

    public String getLogin() {
        return login;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public boolean isActivated() {
        return activated;
    }

    public String getLangKey() {
        return langKey;
    }

    public Set<String> getAuthorities() {
        return authorities;
    }

    public int getTotalFollowings() {
        return totalFollowings;
    }

    public void setTotalFollowings(int totalFollowings) {
        this.totalFollowings = totalFollowings;
    }

    public int getTotalFollowers() {
        return totalFollowers;
    }

    public void setTotalFollowers(int totalFollowers) {
        this.totalFollowers = totalFollowers;
    }

    public Boolean getFollowedByUser() {
        return followedByUser;
    }

    public void setFollowedByUser(Boolean followedByUser) {
        this.followedByUser = followedByUser;
    }

    public String getUser_image() {
        return user_image;
    }

    public List<User> getFollowersUsers() {
        return followersUsers;
    }

    public void setFollowersUsers(List<User> followersUsers) {
        this.followersUsers = followersUsers;
    }

    public List<User> getFollowingUsers() {
        return followingUsers;
    }

    public void setFollowingUsers(List<User> followingUsers) {
        this.followingUsers = followingUsers;
    }

    @Override
    public String toString() {
        return "UserDTO{" +
            "login='" + login + '\'' +
            ", password='" + password + '\'' +
            ", firstName='" + firstName + '\'' +
            ", lastName='" + lastName + '\'' +
            ", email='" + email + '\'' +
            ", activated=" + activated +
            ", user_image='" + user_image + '\'' +
            ", description='" + description + '\'' +
            ", followedByUser=" + followedByUser +
            ", totalFollowers=" + totalFollowers +
            ", totalFollowings=" + totalFollowings +
            ", followingUsers=" + followingUsers +
            ", followersUsers=" + followersUsers +
            ", langKey='" + langKey + '\'' +
            ", authorities=" + authorities +
            '}';
    }
}
