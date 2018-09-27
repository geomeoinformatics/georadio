package manager;

import com.cloudant.client.api.ClientBuilder;
import com.cloudant.client.api.CloudantClient;
import com.cloudant.client.api.Database;
import config.User;
import org.bson.types.ObjectId;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;

public class CloudantDatabase {

    CloudantClient client = ClientBuilder.url(new URL("https://e111beaf-ab36-4117-8d03-c1d833fc745d-bluemix:" +
            "787f5077370c38555d7a9e5c3b3b53e02e0e653a89dbd39158e1e2b3dcf619a6@e111beaf-ab36-4117-8d03-c1d833fc745d-bluemix.cloudant.com"))
            .build();

    Database db = client.database("main-database2", true);

    public CloudantDatabase() throws MalformedURLException {
    }

    public void listDatabase() {

    }

    public void save(List<User> users) {


        System.out.println("Server Version: " + client.serverVersion());

        List<String> databases = client.getAllDbs();
        System.out.println("All my databases : ");
        for (String db : databases) {
            System.out.println(db);
        }

        db.bulk(users);
    }

//    public void send() {
//        System.out.println("Server Version: " + client.serverVersion());
//        List<User> users =
//        List<String> databases = client.getAllDbs();
//        System.out.println("All my databases : ");
//        for (String db : databases) {
//            System.out.println(db);
//        }
//
//        db.bulk(users);
//    }

    public static void main(String[] args) throws MalformedURLException {
        CloudantClient client = ClientBuilder.url(new URL("https://e111beaf-ab36-4117-8d03-c1d833fc745d-bluemix:" +
                "787f5077370c38555d7a9e5c3b3b53e02e0e653a89dbd39158e1e2b3dcf619a6@e111beaf-ab36-4117-8d03-c1d833fc745d-bluemix.cloudant.com"))
                .build();

        List<String> databases = client.getAllDbs();
        User user = new User(new ObjectId(),
                "r", "n", null, null);
        Database db = client.database("main-database", false);
        db.post(user);
    }
}
