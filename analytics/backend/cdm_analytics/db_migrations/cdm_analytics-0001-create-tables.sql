-- 
-- depends: 

CREATE TABLE tracked_domains (
    domain_name VARCHAR(253) PRIMARY KEY
);
CREATE INDEX tracked_domains_lower_domain_name_idx ON tracked_domains (lower(domain_name));

CREATE TABLE tracked_paths (
    absolute_path VARCHAR(4096) PRIMARY KEY
);

CREATE TABLE clicks (
    id SERIAL PRIMARY KEY,
    domain_name VARCHAR(253) NOT NULL,
    absolute_path VARCHAR(4096) NOT NULL,
    click_count INTEGER NOT NULL,
    UNIQUE (domain_name, absolute_path)
);
CREATE INDEX clicks_click_count_idx ON clicks (click_count);
