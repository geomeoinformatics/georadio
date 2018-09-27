/*
 * Copyright (c) 2017. Timeline. (http://www.tline.xyz) Gopikrishna V.M.
 */

package config;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.dropwizard.jackson.JsonSnakeCase;
import json.ObjectIdDeserializer;
import json.ObjectIdSerializer;
import org.bson.types.ObjectId;
import org.mongodb.morphia.annotations.Entity;
import org.mongodb.morphia.annotations.Id;
import org.mongodb.morphia.annotations.Indexed;
import org.mongodb.morphia.utils.IndexDirection;

import java.util.Set;

@JsonSnakeCase
@Entity(value = "user", noClassnameStored = true)
public class User {
    @Id
    @JsonSerialize(using = ObjectIdSerializer.class)
    @JsonDeserialize(using = ObjectIdDeserializer.class)
    private ObjectId id;
    private String phone;
    private String name;
    private String rescue;
    @Indexed(IndexDirection.GEO2D)
    private double[] location = new double[2];
    private Set<String> items;
    private Long updated;

    public User() {
    }

    @JsonCreator
    public User(
            @JsonProperty("id") @JsonSerialize(using = ObjectIdSerializer.class) ObjectId id,
            @JsonProperty("phone") String phone,
            @JsonProperty("name") String name,
            @JsonProperty("location") final double[] location,
            @JsonProperty("updated") Long updated
    ) {
        this.id = id;
        this.phone = phone;
        this.name = name;
        this.updated = updated;
        this.location = location;
    }

    public ObjectId getId() {
        return id;
    }

    public String getPhone() {
        return phone;
    }

    public String getName() {
        return name;
    }


    public Set<String> getItems() {
        return items;
    }

    public Long getUpdated() {
        return updated;
    }

    public double[] getLocation() {
        return location;
    }

    public void setLocation(double[] location) {
        this.location = location;
    }

    public String getRescue() {
        return rescue;
    }

    public void setRescue(String rescue) {
        this.rescue = rescue;
    }
}
