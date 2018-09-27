package config;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.common.collect.ImmutableMap;
import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.constraints.NotNull;
import java.util.Collections;
import java.util.Map;

public class Configuration extends io.dropwizard.Configuration {
    //@NotEmpty
    private String mongoDbUri;

    //@NotEmpty
    private String mongoDbDatabase;

    //@NotEmpty
    private String secret;

    //@NotNull
    private Map<String, Map<String, String>> viewRendererConfiguration = Collections.emptyMap();

    @JsonProperty
    public String getMongoDbUri() {
        return mongoDbUri;
    }

    @JsonProperty
    public void setMongoDbUri(String mongoDbUri) {
        this.mongoDbUri = mongoDbUri;
    }

    @JsonProperty
    public String getMongoDbDatabase() {
        return mongoDbDatabase;
    }

    @JsonProperty
    public void setMongoDbDatabase(String mongoDbDatabase) {
        this.mongoDbDatabase = mongoDbDatabase;
    }

    @JsonProperty("viewRendererConfiguration")
    public Map<String, Map<String, String>> getViewRendererConfiguration() {
        return viewRendererConfiguration;
    }

    @JsonProperty("viewRendererConfiguration")
    public void setViewRendererConfiguration(Map<String, Map<String, String>> viewRendererConfiguration) {
        final ImmutableMap.Builder<String, Map<String, String>> builder = ImmutableMap.builder();
        for (Map.Entry<String, Map<String, String>> entry : viewRendererConfiguration.entrySet()) {
            builder.put(entry.getKey(), ImmutableMap.copyOf(entry.getValue()));
        }
        this.viewRendererConfiguration = builder.build();
    }

    @JsonProperty
    public String getSecret() {
        return secret;
    }

    @JsonProperty
    public void setSecret(String secret) {
        this.secret = secret;
    }
}
