import com.mongodb.MongoClient;
import config.Configuration;
import config.MongoClientManager;
import config.MongoFactory;
import config.UserDao;
import io.dropwizard.assets.AssetsBundle;
import io.dropwizard.client.JerseyClientBuilder;
import io.dropwizard.client.JerseyClientConfiguration;
import io.dropwizard.forms.MultiPartBundle;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import io.dropwizard.views.ViewBundle;
import manager.BatchParser;
import org.eclipse.jetty.servlets.CrossOriginFilter;
import org.mongodb.morphia.Datastore;
import org.mongodb.morphia.Morphia;
import resource.UserResource;

import javax.servlet.DispatcherType;
import javax.servlet.FilterRegistration;
import javax.ws.rs.client.Client;
import java.util.EnumSet;
import java.util.Map;
import java.util.Timer;

public class LocateApplication extends io.dropwizard.Application<Configuration> {
    public static void main(String[] args) throws Exception {
        new LocateApplication().run(args);
    }

    @Override
    public String getName() {
        return "web-api";
    }

    @Override
    public void initialize(Bootstrap<Configuration> bootstrap) {
        bootstrap.addBundle(new AssetsBundle("/assets", "/", "index.html"));
        bootstrap.addBundle(new MultiPartBundle());
        bootstrap.addBundle(new ViewBundle<Configuration>() {
            @Override
            public Map<String, Map<String, String>> getViewConfiguration(Configuration config) {
                return config.getViewRendererConfiguration();
            }
        });
    }

    public void run(Configuration configuration, Environment environment) throws Exception {
        final MongoFactory mongoFactory = new MongoFactory();
        final MongoClient mongoClient = mongoFactory.build(configuration);
        final MongoClientManager mongoClientManager = new MongoClientManager(mongoClient);


        final Morphia morphia = new Morphia();
        morphia.mapPackage("dao");
        final Datastore datastore = morphia.createDatastore(mongoClient, "Locate");
        datastore.ensureIndexes();

        JerseyClientConfiguration jerseyClient1 = new JerseyClientConfiguration();
        final Client jerseyClient = new JerseyClientBuilder(environment)
                .using(jerseyClient1)
                .build(getName());

        //Initialize DAOs
        environment.jersey().setUrlPattern("/api");
        final UserDao userDao = new UserDao(datastore);

        Timer timer = new Timer();
        timer.scheduleAtFixedRate(new BatchParser(userDao), 1000L, 5 * 1000L);



        final UserResource userResource = new UserResource(userDao);
        environment.jersey().register(userResource);

        environment.lifecycle().manage(mongoClientManager);
        final FilterRegistration.Dynamic cors = environment.servlets().addFilter("crossOriginRequests", CrossOriginFilter.class);
        cors.setInitParameter(CrossOriginFilter.ALLOWED_METHODS_PARAM, "GET,PUT,POST,DELETE,OPTIONS");
        cors.setInitParameter(CrossOriginFilter.ALLOWED_ORIGINS_PARAM, "*");
        cors.setInitParameter(CrossOriginFilter.ACCESS_CONTROL_ALLOW_ORIGIN_HEADER, "*");
        cors.setInitParameter("allowedHeaders", "Content-Type,Authorization,X-Requested-With,Content-Length,Accept,Origin");
        cors.setInitParameter("allowCredentials", "true");
        cors.addMappingForUrlPatterns(EnumSet.allOf(DispatcherType.class), true, "/*");
    }
}
