-- 
-- depends: 

CREATE TABLE tracked_domains (
    domain_name VARCHAR(253) PRIMARY KEY
);
CREATE TABLE tracked_paths (
    absolute_path VARCHAR(4096) PRIMARY KEY
)
