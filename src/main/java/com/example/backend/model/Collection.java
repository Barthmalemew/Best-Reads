package com.example.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "COLLECTION")
public class Collection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    public long getId()
    {
        return id;
    }

    public void setId(long id)
    {
        this.id = id;
    }

    public String getName()
    {
        return name;
    }

    public void setName(String name)
    {
        this.name = name;
    }

    @Override
    public String toString() 
    {
        return "Collection{" +"id='" + id + '\''
        + ", Name= " + name + '\'' + '}';
    }
}
