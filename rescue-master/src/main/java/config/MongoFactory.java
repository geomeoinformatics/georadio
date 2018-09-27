package config;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import config.Configuration;

public class MongoFactory {
    public final MongoClient build(final Configuration configuration) {

        String DATABASE_URL = "mongodb://localhost:27017";
        String COLLECTION = "kerala";

        final MongoClientURI mongoClientURI = /*System.getenv("DATABASE").isEmpty() ?*/
                new MongoClientURI(DATABASE_URL) /*:
                new MongoClientURI(System.getenv("DATABASE"))*/;

        return new MongoClient(mongoClientURI);
    }
}
