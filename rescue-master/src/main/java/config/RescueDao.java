package config;

import org.bson.types.ObjectId;
import org.mongodb.morphia.Datastore;
import org.mongodb.morphia.dao.BasicDAO;
import org.mongodb.morphia.geo.Point;
import org.mongodb.morphia.query.Query;
import org.mongodb.morphia.query.UpdateOperations;
import org.mongodb.morphia.query.UpdateResults;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.mongodb.morphia.geo.GeoJson.point;

public class RescueDao extends BasicDAO<User, ObjectId> {

    public RescueDao(Datastore datastore) {
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

    public void addNeeds(Set<String> items, ObjectId id) {
        Query<User> query = this.createQuery()
                .field("_id").equal(id);
        final UpdateOperations<User> ops = this.createUpdateOperations();
        if (items == null) {
            return;
        }
        ops.set("updated", System.currentTimeMillis());
        ops.set("items", items);

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
