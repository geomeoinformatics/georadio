package config;

import com.mongodb.MongoClient;
import io.dropwizard.lifecycle.Managed;

public class MongoClientManager implements Managed {
    private final MongoClient client;

    public MongoClientManager(MongoClient client) {
        this.client = client;
    }

    @Override
    public void start() throws Exception {
    }

    @Override
    public void stop() throws Exception {
        client.close();
    }
}
