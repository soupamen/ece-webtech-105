alter table public.lists
  add constraint lists_name_length
    check (char_length(btrim(name)) between 1 and 80),
  add constraint lists_description_length
    check (description is null or char_length(description) <= 500);
