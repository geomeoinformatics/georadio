package config;

import com.mongodb.Block;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import org.mongodb.morphia.geo.Point;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.mongodb.morphia.Datastore;
import org.mongodb.morphia.dao.BasicDAO;
import org.mongodb.morphia.query.Query;
import org.mongodb.morphia.query.UpdateOperations;
import org.mongodb.morphia.query.UpdateResults;

import static org.mongodb.morphia.geo.GeoJson.point;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public class UserDao extends BasicDAO<User, ObjectId> {

    public UserDao(Datastore datastore) {
        super(datastore);
    }

    public Optional<User> getUser(ObjectId userId) {
        final User user = this.createQuery()
                .field("_id").equal(userId)
                .get();
        return Optional.ofNullable(user);
    }

    public ObjectId createUser(User user) {
        this.save(user);
        return user.getId();
    }

    public List<User> getUsers() {
        return this.createQuery().asList();
    }

    public List<User> getUsersUpdatedAfter(Long u) {
        return this.createQuery()
                .field("updated").greaterThan(u).asList();
    }

    public void addNeeds(Set<String> items, ObjectId id) {
        Query<User> query = this.createQuery()
                .field("_id").equal(id);
        final UpdateOperations<User> ops = this.createUpdateOperations();
        if (items == null) {
            return;
        }
        ops.set("updated", System.currentTimeMillis());
        if (items != null)
            ops.set("items", items);
        final UpdateResults updateResults = this.update(query, ops);
    }

    public void addRequest(ObjectId id, User user) {
        Query<User> query = this.createQuery()
                .field("_id").equal(id);
        final UpdateOperations<User> ops = this.createUpdateOperations();

        ops.set("updated", System.currentTimeMillis());
        if (user.getLocation() != null)
            ops.set("location", user.getLocation());
        if (user.getRescue() != null)
            ops.set("rescue", user.getRescue());
        final UpdateResults updateResults = this.update(query, ops);
    }

    public Optional<User> readByNum(String number) {
        final User user = this.createQuery()
                .field("number").equal(number)
                .get();
        return Optional.ofNullable(user);
    }

    public List<User> getUsers(Float latitude, Float longitude, Integer range) {
        Point refPoint = point(latitude, longitude);
        List<User> d = this.createQuery().disableValidation().field("location")
                .near(refPoint, range).asList();
        return d;
    }

    public Optional<User> getUserByPhone(String phone) {
        final User user = this.createQuery()
                .field("phone").equal(phone).get();
        return Optional.ofNullable(user);
    }
}
