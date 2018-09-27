/*
 * Copyright (c) 2018. Timeline. (http://www.tline.xyz) Gopikrishna V.M.
 */

package manager;

import config.User;
import config.UserDao;

import java.net.MalformedURLException;
import java.util.List;
import java.util.TimerTask;

public class BatchParser extends TimerTask {
    private int count = 1;
    Long updated = 0L;

    private transient final CloudantDatabase cloudantDatabase = new CloudantDatabase();
    UserDao userDao;

    public BatchParser(UserDao userService) throws MalformedURLException {
        this.userDao = userService;
    }

    // run is a abstract method that defines task performed at scheduled time.
    public void run() {
        System.out.println("== Executing batch parser === count: " + count);
        count = count++;

        System.out.println("updated" + updated);
        List<User> userList = userDao.getUsersUpdatedAfter(updated);
        System.out.println("New items: " + userList.size());
        updated = System.currentTimeMillis();
        cloudantDatabase.save(userList);

    }
}
