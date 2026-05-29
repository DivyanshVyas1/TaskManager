bool ifClicked(int userId){
    static unordered_map<int, deque<long long>> mp;
    
    long long now = time(0);

    auto &dq = mp[userId];

    while(!dq.empty() && now - dq.front() >= 60 ){
        dq.pop_front();
    }
    if(dq.size() >= 3){
        return true;
    }

    dq.push_back(now);
    return false;
}