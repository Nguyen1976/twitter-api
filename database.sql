create database twitter;

use twitter;

CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE user_profiles (
    id varchar(255) PRIMARY KEY,
    user_id varchar(255) NOT NULL,
    display_name VARCHAR(100),
    bio TEXT,
    location VARCHAR(100),
    website VARCHAR(255),
    avatar_url VARCHAR(255),
    header_image_url VARCHAR(255),
    follower_count BIGINT DEFAULT 0,
    following_count BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE follows (
    id varchar(255) PRIMARY KEY,
    follower_id varchar(255) NOT NULL,
    following_id varchar(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Optional: Add foreign keys if user_id in user_profiles is linked
    -- FOREIGN KEY (follower_id) REFERENCES user_profiles(user_id),
    -- FOREIGN KEY (following_id) REFERENCES user_profiles(user_id)
    
    -- Prevent duplicate follows
    UNIQUE KEY uniq_follower_following (follower_id, following_id)
);

CREATE TABLE tweets (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    content_text TEXT,
    type ENUM('TWEET', 'REPLY', 'QUOTE', 'RETWEET') NOT NULL DEFAULT 'TWEET',
    parent_tweet_id VARCHAR(255),

    like_count INT DEFAULT 0,
    reply_count INT DEFAULT 0,
    retweet_count INT DEFAULT 0,

    -- Media fields
    media_url TEXT,
    media_type ENUM('IMAGE', 'VIDEO', 'GIF'),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_parent_tweet 
        FOREIGN KEY (parent_tweet_id) 
        REFERENCES tweets(id) 
        ON DELETE CASCADE
);


CREATE TABLE tweet_media (
    id VARCHAR(255) PRIMARY KEY,
    tweet_id VARCHAR(255) NOT NULL,
    media_url TEXT NOT NULL,
    type ENUM('IMAGE', 'VIDEO', 'GIF') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_tweet_media FOREIGN KEY (tweet_id) REFERENCES tweets(id) ON DELETE CASCADE
);


drop table tweets;


use twitter;

CREATE TABLE likes (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    tweet_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Đảm bảo mỗi người dùng chỉ like một tweet một lần
    CONSTRAINT unique_like UNIQUE (user_id, tweet_id)
);


drop table retweets;
drop table likes;