package com.csye6220.medshop.dao;

import com.csye6220.medshop.model.Med;
import org.springframework.stereotype.Repository;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
public class MedDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }

    public void persist(Med entity) {
        getCurrentSession().save(entity);
    }

    public void update(Med entity) {
        getCurrentSession().merge(entity);
    }

    public Med findById(int id) {
        return (Med) getCurrentSession().get(Med.class, id);
    }

    public void delete(Med entity) {
        getCurrentSession().delete(entity);
    }

    @SuppressWarnings("unchecked")
    public List<Med> findAll() {
        return getCurrentSession().createQuery("from Med").list();
    }

    public void deleteAll() {
        List<Med> entityList = findAll();
        for (Med entity : entityList) {
            delete(entity);
        }
    }
}

